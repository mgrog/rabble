defmodule Rabble.ChatsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Rabble.Chats` context.
  """

  @doc """
  Generate a message.
  """
  def message_fixture(attrs \\ %{}) do
    {:ok, message} =
      attrs
      |> Enum.into(%{
        content: "some content",
        user_id: 1,
        room_id: 1
      })
      |> Rabble.Chats.create_message()

    IO.puts("test")
    IO.inspect(message)
    message
  end

  @doc """
  Generate a room.
  """
  def room_fixture(attrs \\ %{}) do
    {:ok, room} =
      attrs
      |> Enum.into(%{
        title: "some title"
      })
      |> Rabble.Chats.create_room()

    room
  end

  @doc """
  Generate a participant.
  """
  def participant_fixture(attrs \\ %{}) do
    {:ok, participant} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> Rabble.Chats.create_participant()

    participant
  end
end
