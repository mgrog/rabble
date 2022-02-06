defmodule RabbleWeb.ParticipantController do
  use RabbleWeb, :controller

  alias Rabble.Chats
  alias Rabble.Chats.Participant

  action_fallback RabbleWeb.FallbackController

  def index(conn, _params) do
    participants = Chats.list_participants()
    render(conn, "index.json", participants: participants)
  end

  def create(conn, %{"participant" => participant_params}) do
    with {:ok, %Participant{} = participant} <- Chats.create_participant(participant_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.participant_path(conn, :show, participant))
      |> render("show.json", participant: participant)
    end
  end

  def show(conn, %{"id" => id}) do
    participant = Chats.get_participant!(id)
    render(conn, "show.json", participant: participant)
  end

  def update(conn, %{"id" => id, "participant" => participant_params}) do
    participant = Chats.get_participant!(id)

    with {:ok, %Participant{} = participant} <- Chats.update_participant(participant, participant_params) do
      render(conn, "show.json", participant: participant)
    end
  end

  def delete(conn, %{"id" => id}) do
    participant = Chats.get_participant!(id)

    with {:ok, %Participant{}} <- Chats.delete_participant(participant) do
      send_resp(conn, :no_content, "")
    end
  end
end
