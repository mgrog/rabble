defmodule RabbleWeb.PageControllerTest do
  use RabbleWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 302) =~ "<a href=\"/app\">redirected</a>"
  end
end
