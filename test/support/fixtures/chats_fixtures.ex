defmodule Rabble.ChatsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Rabble.Chats` context.
  """

  @doc """
  Generate a message.
  """
  def message_fixture(attrs \\ %{}) do
    room = room_fixture()
    participant = participant_fixture()

    {:ok, message} =
      attrs
      |> Enum.into(%{
        "content" => "some content",
        "room" => room,
        "participant_id" => participant.id
      })
      |> Rabble.Chats.create_message()

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

  @valid_participant_attrs %{nickname: "some name"}

  @doc """
  Generate a participant.
  """
  def participant_fixture(attrs \\ %{}) do
    {:ok, participant} =
      attrs
      |> Enum.into(@valid_participant_attrs)
      |> Rabble.Chats.create_participant()

    participant
  end
end
