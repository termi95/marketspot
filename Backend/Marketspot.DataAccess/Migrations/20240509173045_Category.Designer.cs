﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Marketspot.DataAccess.Entities;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    [DbContext(typeof(UserDbContext))]
    [Migration("20240509173045_Category")]
    partial class Category
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Entities.Category", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<Guid>("ParentId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("backend.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("PasswordAllowTimeToChange")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("PasswordChangeToken")
                        .HasColumnType("uuid");

                    b.Property<long>("Roles")
                        .HasColumnType("bigint");

                    b.Property<string>("Surname")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = new Guid("96dbde9e-41a3-46e2-87db-70abd1e7c55d"),
                            Email = "admin@admin.pl",
                            Name = "admin",
                            Password = "AQAAAAIAAYagAAAAEFMvOOAzL4k+idqThNAhbif3uTKHFGYjJVUukDKgnRyC/rHbd8+eRrCr5xOMKFksXA==",
                            PasswordAllowTimeToChange = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            PasswordChangeToken = new Guid("00000000-0000-0000-0000-000000000000"),
                            Roles = 1L,
                            Surname = "Jefe"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
