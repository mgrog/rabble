defmodule Rabble.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :email, :string, null: false
      add :password_hash, :string, redact: true
    end

    create unique_index(:users, [:email])
  end
end
