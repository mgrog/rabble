defmodule Rabble.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Rabble.Repo

  alias Rabble.Accounts.User
  alias Rabble.Chats
  alias Rabble.Chats.Room

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id) do
    usr =
      Repo.get!(User, id)
      |> Repo.preload(:participant)
      |> Repo.preload(rooms: [:participants])

    # dont need messages here
    rooms =
      usr.rooms
      |> Enum.map(fn r -> %Room{r | messages: []} end)

    %User{usr | rooms: rooms}
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    IO.puts("+++++++")

    changeset =
      %User{}
      |> User.changeset(attrs)

    {status, resp} = Repo.insert(changeset)

    {nextStatus, nextResp} =
      case {status, resp} do
        {:ok, user} ->
          Chats.create_participant(user)

        {:error, resp} ->
          {:error, resp}
      end

    case {nextStatus, resp, nextResp} do
      {:ok, resp, _} ->
        {:ok, resp}

      {:error, _, nextResp} ->
        {:error, nextResp}
    end
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def assoc_participant(%User{} = user) do
    Map.from_struct(user)
    |> Chats.upsert_participant(%{nickname: user.nickname})

    user
    |> Repo.preload(:participant)
    |> User.changeset(%{})
    |> Ecto.Changeset.put_assoc(:participant, %{nickname: user.nickname, user_id: user.id})
    |> Repo.insert(on_conflict: :nothing)
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end
end
