defmodule Rabble.Repo.Migrations.AlterParticipants2 do
  use Ecto.Migration

  def change do
    create unique_index(:participants, [:user_id])
  end
end
