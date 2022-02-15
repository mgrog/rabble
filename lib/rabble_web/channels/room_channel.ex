defmodule RabbleWeb.RoomChannel do
  use RabbleWeb, :channel
  alias Rabble.Chats
  alias RabbleWeb.Presence

  @impl true
  def join("room:" <> room_id, payload, socket) do
    if authorized?(payload) do
      id = String.to_integer(room_id)
      room = Rabble.Chats.get_room!(id)
      usr = Rabble.Accounts.get_user!(socket.assigns.user_id)
      send(self(), :after_join)

      {:ok, %{room: room}, assign(socket, room: room, participant: usr.participant)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    p = socket.assigns.participant

    {:ok, _} =
      Presence.track(socket, p.id, %{
        nickname: p.nickname,
        typing: false
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_in("message", attrs, socket) do
    %{participant: participant, room: room} = socket.assigns

    data =
      attrs
      |> Map.put("participant_id", participant.id)
      |> Map.put("room", room)

    case Chats.create_message(data) do
      {:ok, msg} ->
        broadcast!(socket, "message_added", %{data: msg})
        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  def handle_in("status_update", %{"typing" => typing}, socket) do
    p = socket.assigns.participant

    case Presence.update(socket, p.id, %{id: p.id, nickname: p.nickname, typing: typing}) do
      {:ok, _} ->
        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  Phoenix.Channel.intercept(["presence_diff"])

  @impl true
  def handle_out(
        "presence_diff" = topic,
        %{joins: joins, leaves: leaves},
        %{assigns: %{participant: curr}} = socket
      ) do
    id = to_string(curr.id)
    for_curr_user = Map.has_key?(joins, id) || Map.has_key?(leaves, id)

    if !for_curr_user do
      values =
        for {key, val} <- Map.to_list(joins), into: %{} do
          {key, val.metas |> List.first() |> Map.take([:nickname, :typing])}
        end

      push(socket, topic, values)
    end

    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
