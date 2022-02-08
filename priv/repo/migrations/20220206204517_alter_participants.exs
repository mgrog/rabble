defmodule Rabble.Repo.Migrations.AlterParticipants do
  use Ecto.Migration

  def change do
    rename table("participants"), :name, to: :nickname
  end
end
