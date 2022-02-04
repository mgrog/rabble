defmodule RabbleWeb.AccountChannel do
  use RabbleWeb, :channel
  alias Rabble.{Chats, Accounts}

  @impl true
  def join("account", payload, socket) do
    if authorized?(payload) do
      user = Accounts.get_user!(socket.assigns.user_id)

      {:ok, %{user: user}, assign(socket, :user, user)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("create_new", attrs, socket) do
    current_user = socket.assigns.user
    participants = [current_user | attrs["users"]]

    attrs =
      attrs
      |> Map.put("users", participants)

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
