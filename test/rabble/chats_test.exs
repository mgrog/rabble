defmodule Rabble.ChatsTest do
  use Rabble.DataCase

  alias Rabble.Chats

  describe "messages" do
    alias Rabble.Chats.Message

    import Rabble.ChatsFixtures

    @invalid_attrs %{content: nil}

    test "list_messages/0 returns all messages" do
      message = message_fixture()
      assert Chats.list_messages() == [message]
    end

    test "get_message!/1 returns the message with given id" do
      message = message_fixture()
      assert Chats.get_message!(message.id) == message
    end

    test "create_message/1 with valid data creates a message" do
      valid_attrs = %{content: "some content"}

      assert {:ok, %Message{} = message} = Chats.create_message(valid_attrs)
      assert message.content == "some content"
    end

    test "create_message/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chats.create_message(@invalid_attrs)
    end

    test "update_message/2 with valid data updates the message" do
      message = message_fixture()
      update_attrs = %{content: "some updated content"}

      assert {:ok, %Message{} = message} = Chats.update_message(message, update_attrs)
      assert message.content == "some updated content"
    end

    test "update_message/2 with invalid data returns error changeset" do
      message = message_fixture()
      assert {:error, %Ecto.Changeset{}} = Chats.update_message(message, @invalid_attrs)
      assert message == Chats.get_message!(message.id)
    end

    test "delete_message/1 deletes the message" do
      message = message_fixture()
      assert {:ok, %Message{}} = Chats.delete_message(message)
      assert_raise Ecto.NoResultsError, fn -> Chats.get_message!(message.id) end
    end

    test "change_message/1 returns a message changeset" do
      message = message_fixture()
      assert %Ecto.Changeset{} = Chats.change_message(message)
    end
  end

  describe "rooms" do
    alias Rabble.Chats.Room

    import Rabble.ChatsFixtures

    @invalid_attrs %{title: nil}

    test "list_rooms/0 returns all rooms" do
      room = room_fixture()
      assert Chats.list_rooms() == [room]
    end

    test "get_room!/1 returns the room with given id" do
      room = room_fixture()
      assert Chats.get_room!(room.id) == room
    end

    test "create_room/1 with valid data creates a room" do
      valid_attrs = %{title: "some title"}

      assert {:ok, %Room{} = room} = Chats.create_room(valid_attrs)
      assert room.title == "some title"
    end

    test "create_room/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chats.create_room(@invalid_attrs)
    end

    test "update_room/2 with valid data updates the room" do
      room = room_fixture()
      update_attrs = %{title: "some updated title"}

      assert {:ok, %Room{} = room} = Chats.update_room(room, update_attrs)
      assert room.title == "some updated title"
    end

    test "update_room/2 with invalid data returns error changeset" do
      room = room_fixture()
      assert {:error, %Ecto.Changeset{}} = Chats.update_room(room, @invalid_attrs)
      assert room == Chats.get_room!(room.id)
    end

    test "delete_room/1 deletes the room" do
      room = room_fixture()
      assert {:ok, %Room{}} = Chats.delete_room(room)
      assert_raise Ecto.NoResultsError, fn -> Chats.get_room!(room.id) end
    end

    test "change_room/1 returns a room changeset" do
      room = room_fixture()
      assert %Ecto.Changeset{} = Chats.change_room(room)
    end
  end

  describe "participants" do
    alias Rabble.Chats.Participant

    import Rabble.ChatsFixtures

    @invalid_attrs %{}

    test "list_participants/0 returns all participants" do
      participant = participant_fixture()
      assert Chats.list_participants() == [participant]
    end

    test "get_participant!/1 returns the participant with given id" do
      participant = participant_fixture()
      assert Chats.get_participant!(participant.id) == participant
    end

    test "create_participant/1 with valid data creates a participant" do
      valid_attrs = %{}

      assert {:ok, %Participant{} = participant} = Chats.create_participant(valid_attrs)
    end

    test "create_participant/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chats.create_participant(@invalid_attrs)
    end

    test "update_participant/2 with valid data updates the participant" do
      participant = participant_fixture()
      update_attrs = %{}

      assert {:ok, %Participant{} = participant} = Chats.update_participant(participant, update_attrs)
    end

    test "update_participant/2 with invalid data returns error changeset" do
      participant = participant_fixture()
      assert {:error, %Ecto.Changeset{}} = Chats.update_participant(participant, @invalid_attrs)
      assert participant == Chats.get_participant!(participant.id)
    end

    test "delete_participant/1 deletes the participant" do
      participant = participant_fixture()
      assert {:ok, %Participant{}} = Chats.delete_participant(participant)
      assert_raise Ecto.NoResultsError, fn -> Chats.get_participant!(participant.id) end
    end

    test "change_participant/1 returns a participant changeset" do
      participant = participant_fixture()
      assert %Ecto.Changeset{} = Chats.change_participant(participant)
    end
  end

  describe "participants" do
    alias Rabble.Chats.Participant

    import Rabble.ChatsFixtures

    @invalid_attrs %{name: nil}

    test "list_participants/0 returns all participants" do
      participant = participant_fixture()
      assert Chats.list_participants() == [participant]
    end

    test "get_participant!/1 returns the participant with given id" do
      participant = participant_fixture()
      assert Chats.get_participant!(participant.id) == participant
    end

    test "create_participant/1 with valid data creates a participant" do
      valid_attrs = %{name: "some name"}

      assert {:ok, %Participant{} = participant} = Chats.create_participant(valid_attrs)
      assert participant.name == "some name"
    end

    test "create_participant/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chats.create_participant(@invalid_attrs)
    end

    test "update_participant/2 with valid data updates the participant" do
      participant = participant_fixture()
      update_attrs = %{name: "some updated name"}

      assert {:ok, %Participant{} = participant} = Chats.update_participant(participant, update_attrs)
      assert participant.name == "some updated name"
    end

    test "update_participant/2 with invalid data returns error changeset" do
      participant = participant_fixture()
      assert {:error, %Ecto.Changeset{}} = Chats.update_participant(participant, @invalid_attrs)
      assert participant == Chats.get_participant!(participant.id)
    end

    test "delete_participant/1 deletes the participant" do
      participant = participant_fixture()
      assert {:ok, %Participant{}} = Chats.delete_participant(participant)
      assert_raise Ecto.NoResultsError, fn -> Chats.get_participant!(participant.id) end
    end

    test "change_participant/1 returns a participant changeset" do
      participant = participant_fixture()
      assert %Ecto.Changeset{} = Chats.change_participant(participant)
    end
  end
end
