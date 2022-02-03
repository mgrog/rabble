defmodule Rabble.Repo.Migrations.AddUsersToMessages do
  use Ecto.Migration

  def change do
    alter table(:messages) do
      add :user_id, references(:users)
      add :room_id, references(:rooms, on_delete: :delete_all)
    end
  end
end
