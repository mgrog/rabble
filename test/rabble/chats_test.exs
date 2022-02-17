defmodule Rabble.ChatsTest do
  use Rabble.DataCase

  alias Rabble.Chats
  import Rabble.AssertHelpers

  describe "messages" do
    alias Rabble.Chats.Message
    alias Rabble.Chats.Room

    import Rabble.ChatsFixtures

    @invalid_attrs %{"content" => nil, "room" => nil, "participant_id" => nil}

    test "list_messages/0 returns all messages" do
      message = message_fixture()
      assert ignore_unloaded(Chats.list_messages(), [message])
    end

    test "get_message!/1 returns the message with given id" do
      message = message_fixture()
      assert Chats.get_message!(message.id) == message
    end

    test "create_message/1 with valid data creates a message" do
      room = room_fixture()
      participant = participant_fixture()

      valid_attrs = %{
        "content" => "some content",
        "participant_id" => participant.id,
        "room" => room
      }

      assert {:ok, %Message{} = message} = Chats.create_message(valid_attrs)
      assert message.content == "some content"
      assert message.participant_id == participant.id
      assert message.room_id == room.id
    end

    test "create_message/1 with invalid data returns error changeset" do
      assocs = %{"room" => room_fixture(), "participant_id" => participant_fixture().id}

      invalid =
        @invalid_attrs
        |> Map.merge(assocs)

      assert {:error, %Ecto.Changeset{}} = Chats.create_message(invalid)
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
    import Rabble.AccountsFixtures

    @invalid_attrs %{"title" => nil, "participants" => [%{"user_id" => 1}]}

    test "list_rooms/0 returns all rooms" do
      room = room_fixture()
      assert Chats.list_rooms() == [room]
    end

    test "get_room!/1 returns the room with given id" do
      room = room_fixture()
      assert ignore_unloaded(Chats.get_room!(room.id), room)
    end

    test "create_room/1 with valid data creates a room" do
      valid_attrs = %{
        title: "some title",
        users: [user_fixture()],
        participants: [participant_fixture()]
      }

      assert {:ok, %Room{} = room} = Chats.create_room(valid_attrs)
      assert room.title == "some title"
    end

    test "create_room/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chats.create_room(@invalid_attrs)
    end

    test "update_room/2 with valid data updates the room" do
      participant = %{"user_id" => 1}
      room = room_fixture()
      update_attrs = %{"title" => "some updated title", "participants" => [participant]}

      assert {:ok, %Room{} = room} = Chats.update_room(room, update_attrs)
      assert room.title == "some updated title"
    end

    test "update_room/2 with invalid data returns error changeset" do
      room = room_fixture()
      assert {:error, %Ecto.Changeset{}} = Chats.update_room(room, @invalid_attrs)
      assert ignore_unloaded(room, Chats.get_room!(room.id))
    end

    test "delete_room/1 deletes the room" do
      room = room_fixture()
      assert {:ok, %Room{}} = Chats.delete_room(room)
      assert_raise Ecto.NoResultsError, fn -> Chats.get_room!(room.id) end
    end

    test "change_room/1 returns a room changeset" do
      room = room_fixture()
      attrs = %{"participants" => []}

      assert %Ecto.Changeset{} = Chats.change_room(room, attrs)
    end
  end

  describe "participants" do
    alias Rabble.Chats.Participant

    import Rabble.AccountsFixtures
    import Rabble.ChatsFixtures

    @valid_attrs %{nickname: "some name"}
    @invalid_attrs %{nickname: nil}

    test "list_participants/0 returns all participants" do
      participant = participant_fixture()
      assert Chats.list_participants() == [participant]
    end

    test "get_participant!/1 returns the participant with given id" do
      participant = participant_fixture()
      assert Chats.get_participant!(participant.id) == participant
    end

    test "create_participant/1 with valid data creates a participant" do
      assert {:ok, %Participant{} = participant} = Chats.create_participant(@valid_attrs)
      assert participant.nickname == "some name"
    end

    test "create_participant/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chats.create_participant(@invalid_attrs)
    end

    test "update_participant/2 with valid data updates the participant" do
      participant = participant_fixture()
      update_attrs = %{nickname: "some updated name"}

      assert {:ok, %Participant{} = participant} =
               Chats.update_participant(participant, update_attrs)

      assert participant.nickname == "some updated name"
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
