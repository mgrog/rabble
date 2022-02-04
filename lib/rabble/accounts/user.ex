defmodule Rabble.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Rabble.Chats.Room

  @derive {Jason.Encoder, only: [:nickname, :email, :id, :rooms]}

  schema "users" do
    field :nickname, :string
    field :email, :string
    field :token, :string
    has_many :messages, Rabble.Chats.Message

    many_to_many(
      :rooms,
      Room,
      join_through: "participants",
      on_replace: :delete
    )

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:nickname])
    |> validate_required([:nickname])
  end
end
