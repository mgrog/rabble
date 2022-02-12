defmodule Rabble.Chats.Room do
  use Ecto.Schema
  import Ecto.Changeset

  alias Rabble.Accounts
  alias Rabble.Accounts.User
  alias Rabble.Chats.{Message, Participant}

  @derive {Jason.Encoder, only: [:id, :title, :messages, :participants]}

  schema "rooms" do
    field :title, :string
    has_many :messages, Message

    many_to_many(
      :users,
      User,
      join_through: "roomusers",
      on_replace: :delete
    )

    has_many :participants, through: [:users, :participant]

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end
end
