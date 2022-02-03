defmodule Rabble.Repo.Migrations.IntermediateTable do
  use Ecto.Migration

  def change do
    create table(:participants) do
      add :user_id, references(:users)
      add :room_id, references(:rooms)
    end

    create(index(:participants, [:user_id]))
    create(index(:participants, [:room_id]))
  end
end
