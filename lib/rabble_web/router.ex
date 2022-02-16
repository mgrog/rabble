defmodule RabbleWeb.Router do
  use RabbleWeb, :router
  use Pow.Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {RabbleWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug RabbleWeb.APIAuthPlug, otp_app: :my_app
  end

  pipeline :protected do
    plug Pow.Plug.RequireAuthenticated,
      error_handler: Pow.Phoenix.PlugErrorHandler
  end

  pipeline :api_protected do
    plug Pow.Plug.RequireAuthenticated, error_handler: RabbleWeb.APIAuthErrorHandler
  end

  scope "/" do
    pipe_through :browser

    pow_routes()
  end

  scope "/", RabbleWeb do
    pipe_through :browser

    get "/", PageController, :reroute
  end

  scope "/app", RabbleWeb, as: :app do
    pipe_through [:browser, :protected]

    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", RabbleWeb do
    pipe_through [:api, :api_protected]

    get "/me", UserController, :current
    resources "/users", UserController
    resources "/messages", MessageController
    resources "/rooms", RoomController
    resources "/participants", ParticipantController
  end

  # scope "/auth", RabbleWeb do
  #   pipe_through :browser

  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test, :prod] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: RabbleWeb.Telemetry
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
