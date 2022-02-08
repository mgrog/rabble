defmodule RabbleWeb.GlobalChannel do
  use RabbleWeb, :channel
  alias Rabble.{Chats, Accounts}

  @impl true
  def join("global:lobby", payload, socket) do
    if authorized?(payload) do
      user = Accounts.get_user!(socket.assigns.user_id)
      Accounts.assoc_participant(user)

      {:ok, %{user: user}, assign(socket, :user, user)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("create_new", attrs, socket) do
    curr_usr_participant =
      socket.assigns.user.participant
      |> Map.take([:id, :nickname, :user_id])
      |> Map.new(fn {k, v} -> {Atom.to_string(k), v} end)

    case Chats.create_room(attrs, [curr_usr_participant | attrs["participants"]]) do
      {:ok, room} ->
        for %{"user_id" => user_id} <- attrs["participants"] do
          broadcast!(socket, "joined_room", %{id: user_id, chatroom: room})
        end

        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}

      _ ->
        {:reply, {:error, %{errors: "unknown error"}}, socket}
    end
  end

  @impl true
  def handle_in("join_room", _attrs, _socket) do
  end

  @impl true
  def handle_in("leave_room", attrs, socket) do
    IO.inspect(attrs)

    case Chats.delete_room(%{delete_id: attrs["id"]}) do
      {:ok, room} ->
        for %{"user_id" => user_id} <- attrs["participants"] do
          broadcast!(socket, "left_room", %{id: user_id, chatroom: room})
        end

        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  Phoenix.Channel.intercept(["joined_room", "left_room"])

  @impl true
  def handle_out(topic, msg, socket) do
    IO.puts("++++")
    IO.inspect(msg.id)

    if msg.id != socket.assigns[:user_id] do
      {:noreply, socket}
    else
      push(socket, topic, msg)
      {:noreply, socket}
    end

    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
