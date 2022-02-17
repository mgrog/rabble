defmodule Rabble.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Rabble.Accounts` context.
  """

  import Rabble.ChatsFixtures

  @valid_attrs %{
    nickname: "some name",
    email: "fake@email.com",
    password: "abcdefg1234",
    password_confirmation: "abcdefg1234"
  }

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Rabble.Accounts.create_user()

    user
  end
end
