defmodule RabbleWeb.AccountChannel do
  use RabbleWeb, :channel
  alias Rabble.{Chats, Accounts}

  @impl true
  def join("user_account:" <> user_id, payload, socket) do
    if authorized?(payload) do
      chatrooms = Chats.list_rooms()
      user = Accounts.get_user!(user_id)

      {:ok, %{chatrooms: chatrooms, user: user}, assign(socket, :user, user)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (account:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  def handle_in("create_new", attrs, socket) do
    user = socket.assigns

    case Chats.create_room(attrs) do
      {:ok, room} ->
        broadcast!(socket, "rooms:new", %{chatroom: room})
        {:reply, :ok, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}

      _ ->
        {:reply, {:error, %{errors: "unknown error"}}, socket}
    end
  end

  def handle_in("remove", %{id: id} = attrs, socket) do
    case Chats.delete_room(attrs) do
      {:ok, room} ->
        broadcast!(socket, "rooms:remove:#{id}", %{chatroom: room})
        {:reply, :ok, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
