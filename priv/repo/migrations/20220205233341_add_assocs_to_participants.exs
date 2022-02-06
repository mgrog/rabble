defmodule Rabble.Repo.Migrations.AddAssocsToParticipants do
  use Ecto.Migration

  def change do
    alter table(:participants) do
      add :user_id, references(:users)
      add :room_id, references(:rooms)
    end
  end
end
