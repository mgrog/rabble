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
        content: "some content"
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

  @doc """
  Generate a participant.
  """
  def participant_fixture(attrs \\ %{}) do
    {:ok, participant} =
      attrs
      |> Enum.into(%{

      })
      |> Rabble.Chats.create_participant()

    participant
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
