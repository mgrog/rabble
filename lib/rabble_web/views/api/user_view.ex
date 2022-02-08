defmodule RabbleWeb.UserView do
  use RabbleWeb, :view
  alias RabbleWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      nickname: user.nickname,
      email: user.email
    }
  end
end
