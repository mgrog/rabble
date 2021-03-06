defmodule RabbleWeb.GlobalChannel do
  use RabbleWeb, :channel
  alias Rabble.{Chats, Accounts}
  alias Rabble.Chats.Room
  alias RabbleWeb.Presence

  @impl true
  def join("global:lobby", payload, socket) do
    if authorized?(payload) do
      user = Accounts.get_user!(socket.assigns.user_id)
      Accounts.assoc_participant(user)
      send(self(), :after_join)

      {:ok, %{user: user}, assign(socket, :user, user)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, socket.assigns.user_id, %{
        status: "online",
        id: socket.assigns.user.id,
        nickname: socket.assigns.user.nickname,
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_in("create_new", attrs, socket) do
    curr_usr_participant =
      socket.assigns.user.participant
      |> Map.take([:id, :nickname, :user_id])
      |> Map.new(fn {k, v} -> {Atom.to_string(k), v} end)

    case Chats.create_room(attrs, [curr_usr_participant | attrs["participants"]]) do
      {:ok, room} ->
        broadcast!(socket, "joined_room", %{
          data: room,
          to_notify: notify_list([curr_usr_participant | attrs["participants"]])
        })

        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  def handle_in("edit_room", %{"room" => room} = attrs, socket) do
    Chats.get_room!(room["id"])
    |> Chats.update_room(attrs)
    |> case do
      {:ok, room} ->
        broadcast!(socket, "updated_room", %{
          data: room,
          to_notify: notify_list(room.participants)
        })

        RabbleWeb.Endpoint.broadcast_from!(
          self(),
          "room:#{room.id}",
          "users_edited",
          %{
            data: room.participants
          }
        )

        {:noreply, socket}

      {:error, changeset} ->
        {:error, changeset}
    end

    {:noreply, socket}
  end

  def handle_in("leave_room", attrs, socket) do
    usr = socket.assigns.user

    case Chats.leave_room(attrs, usr) do
      {:ok, %Room{} = room} ->
        broadcast!(socket, "deleted_room", %{data: room, to_notify: [socket.assigns.user_id]})
        {:noreply, socket}

      {:ok, %{room: room, user: user}} ->
        broadcast!(socket, "left_room", %{data: room, to_notify: notify_list(room.participants)})
        broadcast!(socket, "deleted_room", %{data: room, to_notify: [socket.assigns.user_id]})

        RabbleWeb.Endpoint.broadcast_from!(
          self(),
          "room:#{room.id}",
          "user_left",
          %{
            data: user
          }
        )

        {:noreply, socket}

      {:error, msg} ->
        {:reply, {:error, %{errors: msg}}, socket}
    end
  end

  Phoenix.Channel.intercept(["joined_room", "left_room", "updated_room", "deleted_room"])

  @impl true
  def handle_out(topic, attrs, socket) do
    if socket.assigns[:user_id] in attrs.to_notify do
      push(socket, topic, Map.drop(attrs, [:to_notify]))
      {:noreply, socket}
    else
      {:noreply, socket}
    end

    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  def notify_list([%{"user_id" => _} = _head | _rest] = list) do
    for x <- list, do: x["user_id"]
  end

  def notify_list([%{user_id: _} = _head | _rest] = list) do
    for x <- list, do: x.user_id
  end

  def notify_list(_list), do: []

  def fetch(_topic, presences) do
    users = presences |> Map.keys() |> Accounts.get_users_map()

    for {key, %{metas: metas}} <- presences, into: %{} do
      {key, %{metas: metas, user: users[String.to_integer(key)]}}
    end
  end
end
