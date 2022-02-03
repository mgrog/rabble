defmodule Rabble.Repo.Migrations.AlterIndex do
  use Ecto.Migration

  def change do
    drop table(:participants)

    create table(:participants) do
      add :user_id, references(:users, on_delete: :delete_all), null: false, primary_key: true
      add :room_id, references(:rooms, on_delete: :delete_all), null: false, primary_key: true
    end

    create index(:participants, [:user_id])
    create index(:participants, [:room_id])
  end
end
