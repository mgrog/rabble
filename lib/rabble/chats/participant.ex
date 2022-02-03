defmodule Rabble.Chats.Participant do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "participants" do
    field :room_id, :id, primary_key: true
    field :user_id, :id, primary_key: true
  end

  @doc false
  def changeset(participant, attrs) do
    participant
    |> cast(attrs, [])
    |> validate_required([])
  end
end
