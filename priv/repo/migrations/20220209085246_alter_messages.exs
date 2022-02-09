defmodule Rabble.Repo.Migrations.AlterMessages do
  use Ecto.Migration

  def change do
    alter table(:messages) do
      remove :user_id
      add :participant_id, references(:participants)
    end
  end
end
