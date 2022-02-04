defmodule Rabble.Repo.Migrations.ReworkJoinTable2 do
  use Ecto.Migration

  def change do
    drop table(:participants)

    create table(:participants) do
      add :user_id, references(:users, on_delete: :delete_all)
      add :room_id, references(:rooms, on_delete: :delete_all)
      add :participant_id, references(:users, on_delete: :delete_all)
      add :room_info_id, references(:rooms, on_delete: :delete_all)
    end

    create index(:participants, [:participant_id])
    create index(:participants, [:room_info_id])
  end
end
