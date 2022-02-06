defmodule Rabble.Repo.Migrations.CreateParticipants do
  use Ecto.Migration

  def change do
    rename table("participants"), to: table("roomusers")

    create table(:participants) do
      add :name, :string

      timestamps()
    end
  end
end
