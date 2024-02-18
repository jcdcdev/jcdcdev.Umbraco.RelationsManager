namespace jcdcdev.Umbraco.RelationsManager.Models;

public class PaginationModel<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public int ItemsPerPage { get; set; }
}