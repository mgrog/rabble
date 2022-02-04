defmodule Rabble.Repo.Migrations.AddToken do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :token, :string
    end
  end
end
