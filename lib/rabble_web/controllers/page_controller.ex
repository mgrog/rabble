defmodule RabbleWeb.PageController do
  use RabbleWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def authenticate(conn, _params) do
    render(conn, "auth.html")
  end

  def reroute(conn, _params) do
    conn |> redirect(to: "/app")
  end
end
