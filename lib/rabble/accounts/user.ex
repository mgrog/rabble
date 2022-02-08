defmodule Rabble.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  use Pow.Ecto.Schema

  alias Rabble.Chats.{Room, Message, Participant}

  @derive {Jason.Encoder, only: [:nickname, :email, :id, :rooms, :participant]}

  schema "users" do
    field :nickname, :string
    field :email, :string
    field :token, :string
    has_many :messages, Message
    has_one :participant, Participant, on_replace: :update

    many_to_many(
      :rooms,
      Room,
      join_through: "roomusers",
      on_replace: :delete
    )

    pow_user_fields()
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> pow_changeset(attrs)
    |> cast(attrs, [:nickname])
    |> validate_required([:nickname])
  end
end
