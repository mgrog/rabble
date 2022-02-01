defmodule Rabble.Repo do
  use Ecto.Repo,
    otp_app: :rabble,
    adapter: Ecto.Adapters.Postgres
end
