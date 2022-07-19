# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2022-07-19

### Changed

- (BREAKING) Class `ObjectID64` renamed into `ObjectId64`
- (BREAKING) `ObjectID64#encode` & `ObjectID64#decode` renamed into respectfully
  `ObjectId64#fromObjectId` & `ObjectId64#toObjectId`

### Added

- Support for encoding UUIDs with `ObjectId64#fromUUID` & `ObjectId64#toUUID`
- Support for encoding 32 bit integers with `ObjectId64#fromInt` &
  `ObjectId64#toInt`
- Support for encoding bigints with `ObjectId64#fromBigInt` &
  `ObjectId64#toBigInt`

## [2.0.0] - 2021-04-20

## [1.0.3] - 2020-04-10

## [1.0.1] - 2017-06-30

## [1.0.0] - 2016-11-6
