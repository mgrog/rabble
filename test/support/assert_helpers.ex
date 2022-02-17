defmodule Rabble.AssertHelpers do
  def ignore_unloaded(val, assert_val) when is_list(val) and is_list(assert_val) do
    list =
      for x <- val, y <- assert_val do
        ignore_unloaded(x, y)
      end

    Enum.all?(list)
  end

  def ignore_unloaded(val, assert_val) do
    list1 =
      assert_val
      |> Map.from_struct()
      |> Map.to_list()

    list2 =
      val
      |> Map.from_struct()
      |> Map.to_list()

    drop_keys =
      Enum.concat(list1, list2)
      |> Enum.filter(fn {_k, v} -> match?(%Ecto.Association.NotLoaded{}, v) end)
      |> Keyword.keys()
      |> Enum.uniq()

    val =
      val
      |> Map.from_struct()
      |> Map.drop(drop_keys)

    assert_val =
      assert_val
      |> Map.from_struct()
      |> Map.drop(drop_keys)

    val == assert_val
  end
end
