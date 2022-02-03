defmodule Rabble.Chats.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:content, :user, :room, :inserted_at]}

  schema "messages" do
    field :content, :string
    belongs_to :user, Rabble.Accounts.User
    belongs_to :room, Rabble.Chats.Room

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:content])
    |> validate_required([:content])
  end
end
