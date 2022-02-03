defmodule RabbleWeb.PageController do
  use RabbleWeb, :controller
  alias Ueberauth.Strategy.Helpers

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def authenticate(conn, _params) do
    render(conn, "auth.html", callback_url: "#{Helpers.callback_url(conn)}/auth/identity/callback")
  end
end
