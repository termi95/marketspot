﻿namespace Marketspot.Model.Offer
{
    public class OfferQueryDto
    {
        public int Page { get; set; }
        public string SearchText { get; set; }
        public string SortBy { get; set; }
        public bool SortDescending { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
