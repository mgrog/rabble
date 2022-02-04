defmodule Rabble.Repo.Migrations.RenameUserName do
  use Ecto.Migration

  def change do
    rename table(:users), :name, to: :nickname
  end
end
