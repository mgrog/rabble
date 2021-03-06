defmodule RabbleWeb.ParticipantView do
  use RabbleWeb, :view
  alias RabbleWeb.ParticipantView

  def render("index.json", %{participants: participants}) do
    %{data: render_many(participants, ParticipantView, "participant.json")}
  end

  def render("show.json", %{participant: participant}) do
    %{data: render_one(participant, ParticipantView, "participant.json")}
  end

  def render("participant.json", %{participant: participant}) do
    %{
      id: participant.id,
      user_id: participant.user_id,
      nickname: participant.nickname
    }
  end
end
