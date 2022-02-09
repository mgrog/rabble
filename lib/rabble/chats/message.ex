defmodule Rabble.Chats.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:content, :updated_at, :participant]}

  schema "messages" do
    field :content, :string
    belongs_to :participant, Rabble.Chats.Participant
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
