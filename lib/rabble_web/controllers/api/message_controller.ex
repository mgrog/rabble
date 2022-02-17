defmodule RabbleWeb.MessageController do
  use RabbleWeb, :controller

  alias Rabble.Chats

  action_fallback RabbleWeb.FallbackController

  def index(conn, _params) do
    messages = Chats.list_messages()
    render(conn, "index.json", messages: messages)
  end

  def show(conn, %{"id" => id}) do
    message = Chats.get_message!(id)
    render(conn, "show.json", message: message)
  end
end
