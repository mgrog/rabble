defmodule Rabble.Repo.Migrations.ReworkJoinTable do
  use Ecto.Migration

  def change do
    rename(table("participants"), :room_id, to: :room_info_id)
    rename(table("participants"), :user_id, to: :participant_id)
  end
end
