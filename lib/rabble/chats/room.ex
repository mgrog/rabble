defmodule Rabble.Chats.Room do
  use Ecto.Schema
  import Ecto.Changeset

  alias Rabble.Accounts.User

  @derive {Jason.Encoder, only: [:id, :title, :messages]}

  schema "rooms" do
    field :title, :string
    has_many :messages, Rabble.Chats.Message

    many_to_many(
      :users,
      User,
      join_through: "participants",
      on_replace: :delete
    )

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end
end
