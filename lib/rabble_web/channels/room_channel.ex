defmodule RabbleWeb.RoomChannel do
  use RabbleWeb, :channel
  alias Rabble.Chats

  @impl true
  def join("room:" <> room_id, payload, socket) do
    if authorized?(payload) do
      id = String.to_integer(room_id)
      room = Rabble.Chats.get_room!(id)
      usr = Rabble.Accounts.get_user!(socket.assigns.user_id)

      {:ok, %{room: room}, assign(socket, room: room, participant_id: usr.participant.id)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("message", attrs, socket) do
    %{participant_id: participant_id, room: room} = socket.assigns

    data =
      attrs
      |> Map.put("participant_id", participant_id)
      |> Map.put("room", room)

    case Chats.create_message(data) do
      {:ok, msg} ->
        IO.inspect(msg)
        broadcast!(socket, "message_added", %{data: msg})
        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  @impl true
  def handle_in("user_left", attrs, socket) do
    IO.puts("+++++++++++ user left ++++++++")
    IO.inspect(attrs)
  end

  # Phoenix.Channel.intercept(["message_added"])

  # @impl true
  # def handle_out("message_added", attrs, socket) do
  #   if(attrs.user_id == socket.assigns.user.id) do
  #     {:noreply, socket}
  #   else
  #     push(socket, "message_added", attrs)
  #   end
  # end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
