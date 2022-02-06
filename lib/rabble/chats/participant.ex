defmodule Rabble.Chats.Participant do
  use Ecto.Schema
  import Ecto.Changeset

  alias Rabble.Chats.Room
  alias Rabble.Accounts.User

  @derive {Jason.Encoder, only: [:name]}

  schema "participants" do
    field :name, :string
    belongs_to :room, Room
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(participant, attrs) do
    participant
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
