defmodule Rabble.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Rabble.Repo,
      # Start the Telemetry supervisor
      RabbleWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Rabble.PubSub},
      # Start the Endpoint (http/https)
      RabbleWeb.Endpoint,
      # Online Presence
      RabbleWeb.Presence,
      # Clean pow store
      {Pow.Postgres.Store.AutoDeleteExpired, [interval: :timer.hours(24)]}
      # Start a worker by calling: Rabble.Worker.start_link(arg)
      # {Rabble.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Rabble.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RabbleWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
