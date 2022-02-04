defmodule Rabble.Repo.Migrations.ReworkJoinTable4 do
  use Ecto.Migration

  def change do
    alter table("participants") do
      remove :participant_id
      remove :room_info_id
    end
  end
end
