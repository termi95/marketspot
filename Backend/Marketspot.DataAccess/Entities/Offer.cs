﻿using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Marketspot.DataAccess.Entities
{
    public class Offer
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(128), NotNull]
        public string Tittle { get; set; }

        [MaxLength(512), NotNull]
        public string Description { get; set; }
        [NotNull]
        public int Price { get; set; }
        [NotNull, MinLength(1)]
        public List<string> Photos { get; set; }

        public User User { get; set; }
        public virtual Category Category { get; set; }

    }
}
