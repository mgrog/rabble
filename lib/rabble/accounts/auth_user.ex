defmodule Rabble.Accounts.AuthUser do
  use Ecto.Schema
  import Ecto.Changeset
  use Pow.Ecto.Schema

  @derive {Jason.Encoder, only: [:nickname, :email, :id, :token]}

  schema "users" do
    field :nickname, :string
    field :token, :string
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
