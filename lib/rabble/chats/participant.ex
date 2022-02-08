defmodule Rabble.Chats.Participant do
  use Ecto.Schema
  import Ecto.Changeset

  alias Rabble.Chats.Room
  alias Rabble.Accounts.User

  @derive {Jason.Encoder, only: [:nickname, :user_id, :id]}

  schema "participants" do
    field :nickname, :string
    belongs_to :room, Room
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(participant, attrs) do
    participant
    |> cast(attrs, [:nickname])
    |> unique_constraint(:user_id)
    |> validate_required([:nickname])
  end
end
