defmodule Rabble.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Rabble.Chats.Room

  @derive {Jason.Encoder, only: [:name, :id]}

  schema "users" do
    field :name, :string

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
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
