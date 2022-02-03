defmodule RabbleWeb.RoomChannel do
  use RabbleWeb, :channel
  alias Rabble.Chats

  @impl true
  def join("room:" <> room_id, payload, socket) do
    if authorized?(payload) do
      %{messages: msgs} = Chats.get_room!(room_id)

      {:ok, %{messages: msgs}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  @spec handle_in(<<_::32, _::_*8>>, any, any) ::
          {:noreply, Phoenix.Socket.t()} | {:reply, {:ok, any}, any}
  def handle_in("ping", payload, socket) do
    IO.puts("++++")
    IO.puts("ping")
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
